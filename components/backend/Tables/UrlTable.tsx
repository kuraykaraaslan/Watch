'use client'
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Url } from "@prisma/client";
import axiosInstance from "@/libs/axios";
import Image from 'next/image';


const UrlTable = () => {
    const [urls, seturls] = useState<Url[]>([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);

    const [search, setSearch] = React.useState('');

    useEffect(() => {

        axiosInstance.get(`/api/urls?page=${page + 1}&pageSize=${pageSize}&search=${search}`)
            .then((response) => {
                seturls(response.data.urls);
                setTotal(response.data.total);
            })
            .catch((error) => {
                console.error(error);
            });
    }
        , [page, pageSize, search]);


    const deleteUrl = async (urlId: string) => {
        //confirm
        if (!confirm('Are you sure you want to delete this url?')) {
            return;
        }

        //delete
        try {
            await axiosInstance.delete(`/api/urls/${urlId}`);
            seturls(urls.filter((url) => url.urlId !== urlId));
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="container mx-auto">
            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <h1 className="text-3xl font-bold h-16 md:items-center">urls</h1>
                <div className="flex gap-2 h-16 w-full md:w-auto md:flex-none">
                    <input type="text" placeholder="Search" className="input input-bordered flex-1 md:flex-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Link className="btn btn-primary btn-sm h-12" href="/backend/urls/create">
                        Create Url
                    </Link>
                </div>
            </div>


            <div className="overflow-x-auto w-full bg-base-200 mt-4 rounded-lg min-h-[400px]">
                <table className="table">
                    {/* head */}
                    <thead className="bg-base-300 h-12">
                        <tr className="h-12">
                            <th>Title</th>
                            <th>LInk</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((url, index) => (
                            <tr key={index} className="releative h-12 hover:bg-primary hover:bg-opacity-10">

                                <td>{url.title}</td>
                                <td>{url.link}</td>
                                <td className="flex gap-2 absolute right-4">
                                    <Link href={`/backend/urls/${url.urlId}`} className="btn btn-sm btn-secondary hidden md:flex">Edit</Link>
                                    <Link href={url.link} className="btn btn-sm btn-primary hidden md:flex">Go</Link>
                                    <Link href={`/backend/urls/${url.urlId}/posts`} className="btn btn-sm btn-warning hidden md:flex">Posts</Link>
                                    <button onClick={() => deleteUrl(url.urlId)} className="btn btn-sm btn-secondary">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-3">
                <div>
                    <span>Showing {urls.length} of {total} urls</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setPage(page - 1)} disabled={page === 0} className="btn btn-sm btn-secondary h-12">Previous</button>
                    <button onClick={() => setPage(page + 1)} disabled={(page + 1) * pageSize >= total} className="btn btn-sm btn-secondary h-12">Next</button>
                </div>
            </div>
        </div>
    );
}

export default UrlTable;