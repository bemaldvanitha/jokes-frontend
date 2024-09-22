"use client";
import React, { useState } from 'react';
import { message } from "antd";
import { useRouter } from 'next/navigation';

import CustomButton from "@/components/common/custom-button/CustomButton";
import CustomInput from "@/components/common/custom-input/CustomInput";
import CustomLoader from "@/components/common/custom-loader/CustomLoader";
import { useLoginMutation } from "@/slicers/authSlice";

import styles from "./page.module.css";

const LoginScreen = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isFieldError, setIsFieldError] = useState({
        isEmailError: false,
        isPasswordError: false
    });

    const [login, { isLoading }] = useLoginMutation();

    const handleChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const emailChangeHandler = (e) => {
        handleChange('email', e.target.value);
    }

    const passwordChangeHandler = (e) => {
        handleChange('password', e.target.value);
    }

    const submitHandler = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValidity = emailRegex.test(formData.email);
        const passwordValidity = formData.password.trim().length >= 5;

        setIsFieldError({
            isEmailError: false,
            isPasswordError: false
        });

        if(emailValidity && passwordValidity){
            try{
                const res = await login({
                    email: formData.email,
                    password: formData.password
                }).unwrap();

                const token = res?.token;

                localStorage.setItem('token', token)

                message.success(res?.message);

                router.push('/moderate');
            }catch (err){
                message.error(err?.data?.message);
            }
        }else {
            setIsFieldError({
                isEmailError: !emailValidity,
                isPasswordError: !passwordValidity
            });
        }
    }

    if(isLoading){
        return <CustomLoader/>
    }else {
        return(
            <div className={styles.loginScreen}>
                <div className={styles.loginScreenContainer}>
                    <p className={styles.loginScreenTitle}>Login</p>
                    <CustomInput value={formData.email} type={'email'} id={'email'} title={'Enter Email'}
                                 placeholder={'Enter email'} errorMessage={'Enter valid email'}
                                 isError={isFieldError.isEmailError} onChangeHandle={emailChangeHandler}/>
                    <CustomInput value={formData.password} type={'password'} id={'password'}
                                 title={'Enter Password'} isError={isFieldError.isPasswordError}
                                 onChangeHandle={passwordChangeHandler} placeholder={'Enter password'}
                                 errorMessage={'Enter Valid password (password should be more than 5 chars)'}/>
                    <CustomButton title={'Login'} fontColor={'#f0f0f0'} bgColor={'#fcb247'}
                                  onClick={submitHandler}/>
                </div>
            </div>
        )
    }
}

export default LoginScreen;