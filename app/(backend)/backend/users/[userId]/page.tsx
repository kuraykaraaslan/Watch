'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/libs/axios';
import { toast } from 'react-toastify';


const UpdateUser =({ params }: { params: { userId: string } }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER');

    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name === '') {
            toast.error('Name is required');
            return;
        }

        if (email === '') {
            toast.error('Email is required');
            return;
        }


        if (role === '') {
            toast.error('Role is required');
            return;
        }

        await axiosInstance.put('/api/users/' + params.userId, {
            name,
            email,
            role,
        }).then(() => {
            toast.success('User updated successfully');
            router.push('/backend/users');
        }).catch((error) => {
            toast.error(error.response.data.message);
        });

    };


    useEffect(() => {

        if (params.userId) {
            axiosInstance.get(`/api/users/${params.userId}`).then((res) => {
                const { user } = res.data;
                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, []);

    return (
        <>
            <div className="container mx-auto">
                <div className="flex justify-between items-center flex-row">
                    <h1 className="text-3xl font-bold h-16 items-center">Update User</h1>
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
                            onChange={(e) => setEmail(e.target.value)}
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

                    <button type="submit" className="btn btn-primary block w-full mt-4">Update User</button>
                </form>
            </div>
        </>
    );
}

export default UpdateUser;