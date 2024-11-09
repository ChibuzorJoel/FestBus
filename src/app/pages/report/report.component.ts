import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from 'src/app/Services/report.service';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  reportForm: FormGroup;
  attachmentFile: File | null = null;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{11}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      attachment: ['']
    });
  }

  // Handle file selection for the attachment
  onFileSelected(event: any) {
    this.attachmentFile = event.target.files[0] || null;
  }

  // Submit the form data
  onSubmit() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

   
  this.isSubmitting = true;
  const formData = new FormData();
  formData.append('subject', this.reportForm.get('subject')?.value);
  formData.append('email', this.reportForm.get('email')?.value);
  formData.append('phone', this.reportForm.get('phone')?.value);
  formData.append('message', this.reportForm.get('message')?.value);

  if (this.attachmentFile) {
    formData.append('attachment', this.attachmentFile);
  }

  // Call the service to submit the report
  this.reportService.submitReport(formData).subscribe({
    next: (response) => {
      this.isSubmitting = true;
      this.successMessage = 'Your report has been submitted successfully!';
      this.errorMessage = '';  // Clear error message if any
      this.reportForm.reset(); // Reset form after successful submission
    },
    error: (error) => {
      this.isSubmitting = false;
      this.errorMessage = 'There was an error submitting your report. Please try again later.';
      this.successMessage = '';  // Clear success message if any
    }
  });
  }
}