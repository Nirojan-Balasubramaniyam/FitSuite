import { Pipe, PipeTransform } from '@angular/core';
import { Member } from '../../Models/member';

@Pipe({
  name: 'memberFilter',
  standalone: true
})
export class MemberFilterPipe implements PipeTransform {

  transform(members: Member[], searchText: string): Member[] {
    if (!searchText) {
      return members;  // If there's no search text, return all members
    }
  
    // Remove the "M00" pattern or any similar starting pattern and use the remaining part of the search text
    const filteredSearchText = searchText.replace(/^M00+/i, '');  // Removes M00 or M000... pattern
  
    const normalizedSearchText = filteredSearchText.toLowerCase();  // Lowercase for case-insensitive comparison
  
    return members.filter(member => 
      member.memberId.toString().includes(normalizedSearchText) || 
      member.firstName.toLowerCase().includes(normalizedSearchText) || 
      member.lastName.toLowerCase().includes(normalizedSearchText) || 
      member.email.toLowerCase().includes(normalizedSearchText) || 
      member.nic.toLowerCase().includes(normalizedSearchText)
    );
  }

}
