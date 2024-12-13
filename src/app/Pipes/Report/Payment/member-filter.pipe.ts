import { Pipe, PipeTransform } from '@angular/core';
import { PaymentReport } from '../../../Models/paymentReport';

@Pipe({
  name: 'memberFilter',
  standalone: true
})
export class MemberFilterPipe implements PipeTransform {

  transform(payments: PaymentReport[], memberId: number | null): PaymentReport[] {
    if (!memberId) {
      return payments; // Return all payments if memberId is not provided or is null
    }

    return payments.filter(payment => payment.memberId === memberId); // Filter by exact match of memberId
  }

}
