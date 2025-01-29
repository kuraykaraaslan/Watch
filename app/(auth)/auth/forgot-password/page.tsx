'use client';
import React, { useState } from 'react';

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState('');

    const [verificationCode, setVerificationCode] = useState('');

    const [step, setStep] = useState(1);

    const [method, setMethod] = useState('email');



    return (
        <>
            {step === 1 ? (
                <>
                    <div role="tablist" className="tabs tabs-boxed -mt-4 -mx-4 mb-4">
                        <button onClick={() => setMethod('email')} className={`tab ${method === 'email' ? 'tab-active' : ''}`} disabled={step > 1}>Email</button>
                        <button onClick={() => setMethod('phone')} className={`tab ${method === 'phone' ? 'tab-active' : ''}`} disabled={step > 1}>Phone</button>
                    </div>
                    <div className="space-y-6">
                        {method === 'email' ? (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-primary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        ) : null }

                        <div>
                            <button
                                type="submit"
                                className="block w-full py-2.5 bg-primary font-semibold rounded-lg shadow-md text-white"
                                >
                                Send Verification Code
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label htmlFor="verificationCode" className="block text-sm font-medium leading-6">
                            Verification Code
                        </label>
                        <div className="mt-2">
                            <input
                                id="verificationCode"
                                name="verificationCode"
                                type="text"
                                required
                                autoComplete="verificationCode"
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-primary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6">
                            New Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6">
                            Confirm Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="block w-full py-2.5 bg-primary font-semibold rounded-lg shadow-md text-white"
                            >
                            Reset Password
                        </button>
                    </div>
                </div>

            )}

        </>
    );
};


export default ForgotPasswordPage;