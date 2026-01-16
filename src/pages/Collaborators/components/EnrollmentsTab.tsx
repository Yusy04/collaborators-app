import { useState } from 'react';
import type { Enrollment } from '../types';
import { EnrollmentCard } from './EnrollmentCard';
import { EnrollmentDetailModal } from './EnrollmentDetailModal';

interface EnrollmentsTabProps {
  enrollments: Enrollment[];
  onUpload: (enrollmentId: string, file: File) => void;
  onSubmit: (enrollmentId: string) => void;
}

export const EnrollmentsTab = ({ enrollments, onUpload, onSubmit }: EnrollmentsTabProps) => {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  // Keep selected enrollment in sync with state changes
  const currentEnrollment = selectedEnrollment 
    ? enrollments.find(e => e.id === selectedEnrollment.id) || null
    : null;

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No enrollments yet</h3>
        <p className="text-gray-500 mb-4">Start by enrolling in a campaign from the Announcements tab</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {enrollments.map(enrollment => (
          <EnrollmentCard
            key={enrollment.id}
            enrollment={enrollment}
            onClick={() => setSelectedEnrollment(enrollment)}
          />
        ))}
      </div>

      {currentEnrollment && (
        <EnrollmentDetailModal
          enrollment={currentEnrollment}
          onClose={() => setSelectedEnrollment(null)}
          onUpload={(file) => onUpload(currentEnrollment.id, file)}
          onSubmit={() => onSubmit(currentEnrollment.id)}
        />
      )}
    </div>
  );
};
