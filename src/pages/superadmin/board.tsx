// src/pages/superadmin/board.tsx
import BoardPage from '@/modules/board/BoardPage';
import SuperadminLayout from '@/components/superadmin/SuperadminLayout';

export default function SuperadminBoardPage() {
  return (
    <SuperadminLayout>
      <BoardPage />
    </SuperadminLayout>
  );
}
