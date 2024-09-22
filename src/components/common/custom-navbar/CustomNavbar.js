"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './CustomNavbar.module.css';

const CustomNavbar = () => {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuth(!!token);
        };

        checkAuth();
        const intervalId = setInterval(checkAuth, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('token');
        router.push('/');
    }

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarHeaderContainer}>
                <Link href="/">
                    <p className={styles.navBarHeader}>Home</p>
                </Link>
                <div className={styles.navBarHeaderSubContainer}>
                    <Link href="/submit">
                        <p className={styles.navBarAction}>Submit</p>
                    </Link>
                    {isAuth && <Link href="/moderate">
                        <p className={styles.navBarAction}>Moderate</p>
                    </Link>}
                </div>
            </div>
            <div className={styles.navBarActionContainer}>
                {!isAuth && <Link href="/login">
                    <p className={styles.navBarAction}>Login</p>
                </Link>}
                {isAuth && <div className={styles.logoutBtn} onClick={logoutHandler}>
                    <p className={styles.navBarAction}>Logout</p>
                </div>}
            </div>
        </div>
    );
};

export default CustomNavbar;
