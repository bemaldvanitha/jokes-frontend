"use client";
import React, { useState, useEffect } from 'react';
import { message } from "antd";
import { useRouter } from 'next/navigation';

import CustomSelect from "@/components/common/custom-select/CustomSelect";
import CustomTextArea from "@/components/common/custom-text-area/CustomTextArea";
import CustomButton from "@/components/common/custom-button/CustomButton";
import CustomLoader from "@/components/common/custom-loader/CustomLoader";
import { useSubmitJokeMutation } from "@/slicers/submitJokesSlice";
import { useGetAllJokeTypesQuery } from "@/slicers/deliverJokesSlice";

import styles from "./page.module.css";

const SubmitScreen = () => {
    const router = useRouter();
    const [types, setTypes] = useState(['Dad jokes', 'Yo mama jokes', 'Science jokes']);

    const [formData, setFormData] = useState({
        joke: '',
        type: ''
    });

    const [isFieldError, setIsFieldError] = useState({
       isJokeError: false,
       isTypeError: false
    });

    const [submitJoke, { isLoading: submitJokeIsLoading }] = useSubmitJokeMutation();
    const { data: typeData, isLoading: typeIsLoading, error: typeError } = useGetAllJokeTypesQuery();

    useEffect(() => {
        if(typeData?.types){
            const fetchTypes = typeData?.types || [];
            const transformedData = fetchTypes.map(item => item?.type);
            setTypes(transformedData);
        }
    }, [typeData]);

    const handleChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const jokeChangeHandler = (e) => {
        handleChange('joke', e.target.value);
    }

    const typeChangeHandler = (e) => {
        handleChange('type', e.target.value);
    }

    const submitHandler = async () => {
        const jokeValidity = formData.joke.trim().length >= 5;
        const typeValidity = formData.type.trim().length !== 0;

        setIsFieldError({
            isTypeError: false,
            isJokeError: false
        });

        if(jokeValidity && typeValidity){
            try{
                const res = await submitJoke({
                    joke: formData.joke,
                    type: formData.type
                }).unwrap();

                message.success('Joke Added successfully');

                setFormData({
                    joke: '',
                    type: ''
                })
            }catch (err){
                message.error(err?.data?.message);
            }
        }else {
            setIsFieldError({
                isTypeError: !typeValidity,
                isJokeError: !jokeValidity
            });
        }
    }

    if(submitJokeIsLoading || typeIsLoading){
        return <CustomLoader/>
    }else {
        return(
            <div className={styles.submitJokeScreen}>
                <div className={styles.submitJokeScreenContainer}>
                    <p className={styles.submitJokeScreenTitle}>Submit a joke!</p>
                    <CustomSelect id={'type'} isError={isFieldError.isTypeError} value={formData.type}
                                  errorMessage={'Select joke type'} onChangeHandle={typeChangeHandler}
                                  title={'Select Joke Type'} options={types}/>
                    <CustomTextArea title={'Enter Joke'} value={formData.joke} placeholder={'Enter joke'}
                                    errorMessage={'Joke should contain at-least 5 chars'} id={'joke'}
                                    rows={5} isError={isFieldError.isJokeError}
                                    onChangeHandle={jokeChangeHandler}/>
                    <CustomButton title={'Add Joke'} onClick={submitHandler} fontColor={'#f0f0f0'}
                                  bgColor={'#fcb247'}/>
                </div>
            </div>
        )
    }
}

export default SubmitScreen;