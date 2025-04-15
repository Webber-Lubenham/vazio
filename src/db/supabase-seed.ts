import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

dotenv.config();

// Para o seed, usamos a service_role key que tem permissões administrativas
const supabaseUrl = 'https://rsvjnndhbyyxktbczlnk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQwOTc3OSwiZXhwIjoyMDU4OTg1Nzc5fQ.cnmSutfsHLOWHqMpgIOv5fCHBI0jZG4AN5YJSeHDsEA';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const UserRole = {
  STUDENT: 'student',
  PARENT: 'parent',
  ADMIN: 'admin'
} as const;

async function seed() {
  try {
    console.log('Starting seed process...');

    // Criar 10 usuários de teste
    for (let i = 0; i < 10; i++) {
      const email = faker.internet.email();
      const password = 'password123'; // Senha padrão para teste
      const role = faker.helpers.arrayElement(Object.values(UserRole));
      
      // Criar usuário usando a API admin
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: faker.person.fullName(),
          user_type: role,
          phone_verified: false
        }
      });

      if (authError) {
        console.error(`Error creating user ${email}:`, authError);
        continue;
      }

      console.log(`Created user: ${email} with role: ${role}`);

      // Se for um estudante, criar algumas localizações de teste
      if (role === UserRole.STUDENT && authData.user) {
        const locations = Array.from({ length: 5 }, () => ({
          user_id: authData.user!.id,
          latitude: faker.location.latitude().toString(),
          longitude: faker.location.longitude().toString(),
          accuracy: faker.number.float({ min: 1, max: 100 }).toString(),
          speed: faker.number.float({ min: 0, max: 100 }).toString(),
          heading: faker.number.float({ min: 0, max: 360 }).toString(),
          altitude: faker.number.float({ min: 0, max: 1000 }).toString(),
          timestamp: new Date().toISOString()
        }));

        const { error: locationError } = await supabase
          .from('locations')
          .insert(locations);

        if (locationError) {
          console.error('Error creating locations:', locationError);
        } else {
          console.log(`Created ${locations.length} locations for user ${email}`);
        }
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error in seed process:', error);
    throw error;
  }
}

// Executar o seed
seed()
  .then(() => {
    console.log('Seed process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  });
