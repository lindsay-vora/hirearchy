import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date',
}) => {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value + '-01') : undefined
  );
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'MMMM yyyy');
      setInputValue(formattedDate);
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Try to parse the input value
    try {
      const parsedDate = parse(newValue, 'MMMM yyyy', new Date());
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        onChange(newValue);
      }
    } catch {
      // If parsing fails, just update the input value
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="flex-1"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(!date && 'text-muted-foreground')}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className={cn('p-3 pointer-events-auto')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
