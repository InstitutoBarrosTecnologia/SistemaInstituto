import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Instituto Barros - Sistema"
        description="Instituto Barros - Sistema login"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
