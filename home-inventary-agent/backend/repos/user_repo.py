# backend/repos/user_repo.py

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from models.schema import User, Role
from uuid import UUID
from typing import Optional, List


class UserRepo:

    # ---------------------------------
    # CREATE USER
    # ---------------------------------
    async def create(
        self,
        db: AsyncSession,
        username: str,
        role_id: Optional[UUID] = None
    ) -> User:

        user = User(
            username=username,
            role_id=role_id
        )

        db.add(user)
        await db.flush()
        return user


    # ---------------------------------
    # GET USER BY USERNAME
    # ---------------------------------
    async def get_by_username(
        self,
        db: AsyncSession,
        username: str
    ) -> Optional[User]:

        result = await db.execute(
            select(User).where(User.username == username)
        )

        return result.scalar_one_or_none()


    # ---------------------------------
    # GET USER BY ID
    # ---------------------------------
    async def get_by_id(
        self,
        db: AsyncSession,
        user_id: UUID
    ) -> Optional[User]:

        result = await db.execute(
            select(User).where(User.id == user_id)
        )

        return result.scalar_one_or_none()


    # ---------------------------------
    # LIST USERS
    # ---------------------------------
    async def get_all(
        self,
        db: AsyncSession
    ) -> List[User]:

        result = await db.execute(select(User))
        return result.scalars().all()


    # ---------------------------------
    # DELETE USER
    # ---------------------------------
    async def delete(
        self,
        db: AsyncSession,
        user_id: UUID
    ) -> bool:

        result = await db.execute(
            delete(User).where(User.id == user_id)
        )

        return result.rowcount > 0


    # ---------------------------------
    # CREATE ROLE (OPTIONAL)
    # ---------------------------------
    async def create_role(
        self,
        db: AsyncSession,
        name: str,
        permissions: Optional[dict] = None
    ) -> Role:

        role = Role(
            name=name,
            permissions=permissions
        )

        db.add(role)
        await db.flush()
        return role


    # ---------------------------------
    # LIST ROLES
    # ---------------------------------
    async def list_roles(
        self,
        db: AsyncSession
    ) -> List[Role]:

        result = await db.execute(select(Role))
        return result.scalars().all()
