import { Pipe, PipeTransform } from '@angular/core';
import { Staff } from '../../Models/staff';

@Pipe({
  name: 'staffFilter',
  standalone: true
})
export class StaffFilterPipe implements PipeTransform {

   transform(Staffs: Staff[], searchText: string): Staff[] {
      if (!searchText) {
        return Staffs;  // If there's no search text, return all Staffs
      }
    
      // Remove the "M00" pattern or any similar starting pattern and use the remaining part of the search text
      const filteredSearchText = searchText.replace(/^S00+/i, '');  // Removes M00 or M000... pattern
    
      const normalizedSearchText = filteredSearchText.toLowerCase();  // Lowercase for case-insensitive comparison
    
      return Staffs.filter(Staff => 
        Staff.staffId.toString().includes(normalizedSearchText) || 
        Staff.firstName.toLowerCase().includes(normalizedSearchText) || 
        Staff.lastName.toLowerCase().includes(normalizedSearchText) || 
        Staff.email.toLowerCase().includes(normalizedSearchText) || 
        Staff.nic.toLowerCase().includes(normalizedSearchText)
      );
    }
}
