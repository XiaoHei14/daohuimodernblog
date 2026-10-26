import { createClient } from '@supabase/supabase-js';

const [userId] = process.argv.slice(2);
const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!userId || !url || !serviceRoleKey) {
  console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/set-super-admin.mjs <auth-user-uuid>');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: userData, error: getError } = await supabase.auth.admin.getUserById(userId);
if (getError || !userData.user) {
  console.error('Could not find Supabase Auth user:', getError?.message ?? 'User not found');
  process.exit(1);
}

const appMetadata = {
  ...(userData.user.app_metadata ?? {}),
  is_super_admin: true,
};

const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
  app_metadata: appMetadata,
});

if (updateError) {
  console.error('Could not promote user:', updateError.message);
  process.exit(1);
}

console.log(`Granted is_super_admin=true to ${userData.user.email ?? userId}`);
