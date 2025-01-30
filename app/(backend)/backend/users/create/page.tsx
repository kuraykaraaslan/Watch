'use client';
import React, { useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/libs/axios';
import { toast } from 'react-toastify';
import Image from 'next/image';


const CreateUser = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const neededFields = [name, email, password, role];

        const user = {
            name,
            email,
            password,
            role,
        };

        if (name === '') {
            toast.error('Name is required');
            return;
        }


        if (email === '') {
            toast.error('Email is required');
            return;
        }

        if (password === '') {
            toast.error('Password is required');
            return;
        }

        if (role === '') {
            toast.error('Role is required');
            return;
        }


        await axiosInstance.post('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                name,
                email,
                password,
                role,
            },

        }).then(() => {
            toast.success('User created successfully');
            // router.push('/backend/posts');
        }).catch((error) => {
            toast.error(error.response.data.message);
        });

    };


    return (
        <>
            <div className="container mx-auto">
                <div className="flex justify-between items-center flex-row">
                    <h1 className="text-3xl font-bold h-16 items-center">Create User</h1>
                    <div className="flex gap-2 h-16">
                        <Link className="btn btn-primary btn-sm h-12" href="/backend/users">
                            Back to Users
                        </Link>
                    </div>
                </div>

                <form className="bg-base-200 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="input input-bordered"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered"
                            value={email}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered"
                            value={password}
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary block w-full mt-4">Create Post</button>
                </form>
            </div>
        </>
    );
}

export default CreateUser;