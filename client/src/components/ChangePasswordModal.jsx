import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../schema/UserSchema';
import { updateUserPassword } from '../utils/fetchVolunteerData';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(changePasswordSchema) });
  console.log(errors)
  const onSubmit = async (data) => {
    console.log(data);
    await updateUserPassword(data)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Old Password"
            {...register("oldPassword")}
            className="border rounded p-2"
          />
          {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}

          <input
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
            className="border rounded p-2"
          />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
          <button type="button" className="bg-red-500 text-white p-2 rounded" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
