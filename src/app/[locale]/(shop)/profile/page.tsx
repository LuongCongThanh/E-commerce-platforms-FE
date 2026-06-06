import { ProfileClient } from '@/app/[locale]/(shop)/_lib/components/profile/ProfileClient';

export default function ProfilePage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Thông tin cá nhân</h1>
      <ProfileClient />
    </main>
  );
}
