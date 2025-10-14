import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal,
  MapPin,
  Users,
  Clock,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

export interface FilterOptions {
  locations: string[];
  mutualFriends: boolean;
  onlineOnly: boolean;
  userTypes: string[];
}

interface FilterDropdownProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterDropdown({
  filters,
  onFiltersChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
  ];
  const userTypes = [
    { value: "user", label: "New People", icon: Users },
    { value: "friend", label: "Friends", icon: UserCheck },
    { value: "sent_req", label: "Pending Requests", icon: Clock },
    { value: "req", label: "Friend Requests", icon: Users },
  ];

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];

    onFiltersChange({ ...filters, locations: newLocations });
  };

  const handleUserTypeToggle = (type: string) => {
    const newTypes = filters.userTypes.includes(type)
      ? filters.userTypes.filter((t) => t !== type)
      : [...filters.userTypes, type];

    onFiltersChange({ ...filters, userTypes: newTypes });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      locations: [],
      mutualFriends: false,
      onlineOnly: false,
      userTypes: [],
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.locations.length +
      (filters.mutualFriends ? 1 : 0) +
      (filters.onlineOnly ? 1 : 0) +
      filters.userTypes.length
    );
  };

  const activeCount = getActiveFiltersCount();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-2xl border-2 hover:bg-muted/50 transition-all duration-200 bg-transparent relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenuLabel className="text-base font-semibold p-0">
            Filters
          </DropdownMenuLabel>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-auto p-1 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* User Types */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            User Types
          </DropdownMenuLabel>
          <div className="space-y-3 mt-2">
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.userTypes.includes(type.value)}
                    onCheckedChange={() => handleUserTypeToggle(type.value)}
                  />
                  <label
                    htmlFor={`type-${type.value}`}
                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </label>
                </div>
              );
            })}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-4" />

        {/* Location Filter */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Location
          </DropdownMenuLabel>
          <div className="space-y-3 mt-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-3">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={() => handleLocationToggle(location)}
                />
                <label
                  htmlFor={`location-${location}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-4" />

        {/* Other Filters */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
            Other Options
          </DropdownMenuLabel>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="mutual-friends"
                checked={filters.mutualFriends}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    mutualFriends: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="mutual-friends"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Has mutual friends
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="online-only"
                checked={filters.onlineOnly}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    onlineOnly: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="online-only"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Online only
              </label>
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
