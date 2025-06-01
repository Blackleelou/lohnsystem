// pages/admin/board.tsx
import BoardPage from "@/components/board/BoardPage";
import SuperadminLayout from "@/components/superadmin/SuperadminLayout";

export default function AdminBoardPage() {
  return <BoardPage />;
}

AdminBoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
