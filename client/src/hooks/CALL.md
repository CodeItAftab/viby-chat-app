# 📞 Call Feature Workflow with Database + Rooms + Reconnection

This document describes the **workflow, states, and reconnection strategy** for building a robust audio/video call feature with **MERN + React (Vite) + SimplePeer + Socket.IO**.

---

## 🔹 1. Call Object in Database

When a call is initiated, create a `Call` object in MongoDB.

### Example Call Schema
- **callId** → Unique identifier (UUID or Mongo ObjectId)  
- **caller** → userId of caller  
- **callee** → userId of callee  
- **type** → `audio` or `video`  
- **state** → `calling`, `incoming`, `connecting`, `connected`, `ended`, `missed`  
- **startedAt / endedAt** → timestamps  

This ensures you can show **call history**, analytics, and recover call state on reconnect.

---

## 🔹 2. Room-Based Architecture

Each call has its own **Socket.IO room**:  
- Room name format: `call:<callId>`  
- Both participants **join the room** when call starts or reconnects.  
- All signaling (`offer`, `answer`, `ice`, `end`) is broadcasted **inside the room**.  

---

## 🔹 3. Workflow

### Caller Initiates Call
1. Caller presses **Audio Call** / **Video Call**.  
2. Backend generates a new `callId`, creates a `Call` object in DB.  
3. Caller joins room `call:<callId>`.  
4. Server sends `"call:incoming"` to callee with:
   - `callId`  
   - `callerId`  
   - `type` (audio/video)  

**State Transition:**
- Caller → **CALLING**  
- Callee → **INCOMING**  

---

### Callee Receives Incoming Call
- UI shows *“Incoming {audio/video} call from X”*.  
- Options: **Accept / Reject**.  

- If **Reject** → update call object `state = "ended"`, notify Caller, both return to **IDLE**.  
- If **Accept** → Callee joins `call:<callId>`, backend updates `state = "connecting"`.  

**State Transition:**
- Both → **CONNECTING**  

---

### Connection Establishment
- Caller & Callee exchange **SDP offers/answers** + **ICE candidates** inside `call:<callId>` room.  
- Once media streams flow, backend updates `state = "connected"`.  

**State Transition:**
- Both → **CONNECTED**  

---

### Call in Progress
- Both participants in **CONNECTED** state.  
- Available actions:
  - **Mute/Unmute mic**  
  - **Toggle camera** (if video)  
  - **End call**  

---

### Call End
- Either user clicks End → notify room `call:<callId>`.  
- Backend updates call object:
  - `state = "ended"`  
  - `endedAt = now`  
- Both return to **ENDED → IDLE**.  

---

## 🔹 4. Reconnection Handling

Reconnection must handle **two scenarios**:

### (A) Socket.IO Reconnect
- If a user’s socket disconnects (tab refresh, network drop):  
  1. On reconnect, client re-joins `call:<callId>`.  
  2. Backend checks if call state is still `"connected"` or `"connecting"`.  
  3. If yes → attempt renegotiation:
     - Caller re-sends `offer`  
     - Callee responds with `answer`  
     - ICE exchange again  
  4. If negotiation succeeds → return to **CONNECTED**.  
  5. If timeout (e.g., 15s) → mark call as `ended`.  

### (B) WebRTC Peer Disconnect
- If ICE connection fails:
  - Move to **RECONNECTING** state.  
  - Try to re-offer automatically via signaling channel.  
  - If reconnection fails after retries → move to **ENDED**.  

---

## 🔹 5. Final State Machine

| State          | Trigger                         | Next State(s) |
|----------------|---------------------------------|---------------|
| **IDLE**       | App open, no call               | CALLING / INCOMING |
| **CALLING**    | Caller initiated call           | RINGING / INCOMING / ENDED |
| **INCOMING**   | Callee notified of call         | CONNECTING / ENDED |
| **CONNECTING** | Call accepted, signaling ongoing| CONNECTED / ENDED |
| **CONNECTED**  | Media flowing                   | RECONNECTING / ENDED |
| **RECONNECTING** | Network drop or ICE failure   | CONNECTED / ENDED |
| **ENDED**      | Call finished/rejected/failed   | IDLE |

---

✅ With this model:  
- Every call has a **callId** (room + DB record).  
- Both participants always rejoin by `callId`.  
- Reconnection is possible because **call state is persisted in DB + room membership**.  
