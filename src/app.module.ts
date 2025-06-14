import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UsersModule, CoreModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
