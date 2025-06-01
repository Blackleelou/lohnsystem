// pages/admin/board.tsx
import BoardPage from "@/components/Board/BoardPage";
import SuperadminLayout from "@/components/SuperadminLayout";

export default function AdminBoardPage() {
  return <BoardPage />;
}

AdminBoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
