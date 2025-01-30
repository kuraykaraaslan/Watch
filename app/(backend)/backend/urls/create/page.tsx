'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/libs/axios';
import { toast } from 'react-toastify';
import Image from 'next/image';


const CreateUrl = () => {

    const [title, setTitle] = useState('Default Title');
    const [link, setLink] = useState('default-link');
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const neededFields = [title, link];

        const blogUrl = {
            title,
            link,
        };

        if (title === '') {
            toast.error('Title is required');
            return;
        }


        if (link === '') {
            toast.error('Link is required');
            return;
        }

        await axiosInstance.post('/api/urls', blogUrl).then(() => {
            toast.success('Url created successfully');
            router.push('/backend/urls');
        }).catch((error) => {
            console.error(error);
        });


    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex justify-between items-center flex-row">
                    <h1 className="text-3xl font-bold h-16 items-center">Create Url</h1>
                    <div className="flex gap-2 h-16">
                        <Link className="btn btn-primary btn-sm h-12" href="/backend/urls">
                            Back to Urls
                        </Link>
                    </div>
                </div>

                <form className="bg-base-200 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="input input-bordered"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Link</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Link"
                            className="input input-bordered"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary block w-full mt-4">Create Url</button>
                </form>
            </div>
        </>
    );
}

export default CreateUrl;