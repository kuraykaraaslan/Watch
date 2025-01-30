'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/libs/axios';
import { User } from '@prisma/client';
import { toast } from 'react-toastify';

const UserTable = () => {

    const [users, setUsers] = React.useState<Partial<User>[]>([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);

    const [search, setSearch] = React.useState('');

    useEffect(() => {

        axiosInstance.get(`/api/users?page=${page + 1}&pageSize=${pageSize}&search=${search}`)
            .then((response) => {
                setUsers(response.data.users);
                setTotal(response.data.total);
                console.log(response.data);
            })
            .catch((error) => {
            });
    }
        , [page, pageSize, search]);


    const deleteUser = async (userId: string) => {
        //confirm
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        //delete
        await axiosInstance.delete(`/api/users/${userId}`).then((response) => {
            toast.success(response.data.message || 'User deleted successfully.');
            setUsers(users.filter(user => user.userId !== userId));
        }).catch((error) => {
            toast.error(error.response.data.message || 'Failed to delete user.');
        }
        );

    }


    return (
        <div className="container mx-auto">
            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <h1 className="text-3xl font-bold h-16 md:items-center">Users</h1>
                <div className="flex gap-2 h-16 w-full md:w-auto md:flex-none">
                    <input type="text" placeholder="Search" className="input input-bordered flex-1 md:flex-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Link className="btn btn-primary btn-sm h-12" href="/backend/users/create">
                        Create User
                    </Link>
                </div>
            </div>


            <div className="overflow-x-auto w-full bg-base-200 mt-4 rounded-lg min-h-[400px]">
                <table className="table">
                    {/* head */}
                    <thead className="bg-base-300 h-12">
                        <tr className="h-12">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="h-12 hover:bg-primary hover:bg-opacity-10">
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td className="flex gap-2">
                                    <Link href={`/backend/users/${user.userId}`} className="btn btn-sm btn-primary">Edit</Link>
                                    <button onClick={() => deleteUser(user.userId as string)} className="btn btn-sm btn-warning hidden md:flex">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div>
                    <span>Showing {users.length} of {total} users</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setPage(page - 1)} disabled={page === 0} className="btn btn-sm btn-secondary h-12">Previous</button>
                    <button onClick={() => setPage(page + 1)} disabled={(page + 1) * pageSize >= total} className="btn btn-sm btn-secondary h-12">Next</button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;