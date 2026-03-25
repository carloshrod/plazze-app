import { LogoIcon } from "@/components/common/ui/logos/logo-icon";
import ForgotPasswordForm from "@/components/features/auth/forgot-password-form";

interface Props {
  searchParams: { action?: string; key?: string; login?: string };
}

const ForgotPasswordPage = ({ searchParams }: Props) => {
  const isReset = searchParams.action === "reset";
  const resetKey = isReset ? searchParams.key : undefined;
  const login = isReset ? searchParams.login : undefined;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow p-8 text-gray-900">
          <LogoIcon className="h-12 w-12 mx-auto mb-6 text-primary" />
          <ForgotPasswordForm resetKey={resetKey} login={login} />
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
