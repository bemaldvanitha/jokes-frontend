"use client";
import React, { useState, useEffect } from 'react';
import { message } from "antd";

import CustomSelect from "@/components/common/custom-select/CustomSelect";
import CustomTextArea from "@/components/common/custom-text-area/CustomTextArea";
import CustomInput from "@/components/common/custom-input/CustomInput";
import CustomButton from "@/components/common/custom-button/CustomButton";
import CustomLoader from "@/components/common/custom-loader/CustomLoader";
import { useGetAllJokeTypesQuery } from "@/slicers/deliverJokesSlice";
import { useGetNonModeratedJokeQuery, useDeleteJokeMutation, useRejectJokeMutation,
    useAcceptJokeMutation } from "@/slicers/moderateJokesSlice";
import WithAuth from "@/middlewares/WithAuth";

import styles from "./page.module.css";

const ModerateScreen = () => {
    const [types, setTypes] = useState([]);

    const [formData, setFormData] = useState({
        id: 0,
        joke: '',
        type: '',
        otherJokeType: ''
    });

    const [isFieldError, setIsFieldError] = useState({
        isJokeError: false,
        isTypeError: false,
        isOtherJokeTypeError: false
    });

    const { data: typeData, isLoading: typeIsLoading, error: typeError } = useGetAllJokeTypesQuery();
    const { data: nonModJokeData, isLoading: nonModJokeIsLoading, refetch: nonModJokeRefetch,
        error: nonModJokeError } = useGetNonModeratedJokeQuery();
    const [acceptJoke, { isLoading: acceptJokeIsLoading }] = useAcceptJokeMutation();
    const [rejectJoke, { isLoading: rejectJokeIsLoading }] = useRejectJokeMutation();
    const [deleteJoke, { isLoading: deleteJokeIsLoading }] = useDeleteJokeMutation();

    useEffect(() => {
        if(typeData?.types){
            const fetchTypes = typeData?.types || [];
            const transformedData = fetchTypes.map(item => item?.type);
            transformedData.push('Other')
            setTypes(transformedData);
        }
    }, [typeData]);

    useEffect(() => {
        if(nonModJokeData?.joke){
            let fetchedJoke = nonModJokeData?.joke;

            setFormData({
                id: fetchedJoke?.id,
                joke: fetchedJoke?.joke,
                type: fetchedJoke?.type,
                otherJokeType: ''
            });
        }
    }, [nonModJokeData]);

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

    const otherJokeTypeChangeHandler = (e) => {
        handleChange('otherJokeType', e.target.value);
    }

    const cleanFields = () => {
        setFormData({
            id: 0,
            joke: '',
            type: '',
            otherJokeType: ''
        })
    }

    const acceptHandler = async () => {
        try {
            let id = formData?.id;
            let body = {
                joke: formData?.joke,
                type: formData?.type
            }

            const res = await acceptJoke({ id, body }).unwrap();
            cleanFields();

            message.success(res?.message);
            await nonModJokeRefetch()
        }catch (error){
            console.log(error);
            message.error('Joke Accept Failed');
        }
    }

    const rejectHandler = async () => {
        try {
            const res = await rejectJoke(formData?.id).unwrap();
            cleanFields();
            message.success(res?.message);
            await nonModJokeRefetch()
        }catch (error){
            console.log(error);
            message.error('Joke Reject Failed');
        }
    }

    const deleteHandler = async () => {
        try {
            const res = await deleteJoke(formData?.id).unwrap();
            cleanFields();
            message.success(res?.message);
            await nonModJokeRefetch()
        }catch (error){
            console.log(error);
            message.error('Joke Delete Failed');
        }
    }

    if(typeIsLoading || nonModJokeIsLoading || acceptJokeIsLoading || rejectJokeIsLoading ||
        deleteJokeIsLoading){
        return <CustomLoader/>
    }else {
        return(
            <div className={styles.moderationJokeScreen}>
                <div className={styles.moderationJokeScreenContainer}>
                    <p className={styles.moderationJokeScreenTitle}>Moderate Jokes</p>
                    <CustomSelect id={'type'} isError={isFieldError.isTypeError} value={formData.type}
                                  errorMessage={'Select joke type'} onChangeHandle={typeChangeHandler}
                                  title={'Select Joke Type'} options={types}/>
                    {formData.type === 'Other' && <CustomInput type={'text'} value={formData.otherJokeType}
                                  title={'Enter Joke Type (Other)'} id={'otherJokeType'}
                                  onChangeHandle={otherJokeTypeChangeHandler}
                                  isError={isFieldError.isOtherJokeTypeError}
                                  errorMessage={'Enter valid joke type (other)'}
                                  placeholder={'Enter joke type (other)'}/>}
                    <CustomTextArea title={'Enter Joke'} value={formData.joke} placeholder={'Enter joke'}
                                    errorMessage={'Joke should contain at-least 5 chars'} id={'joke'}
                                    rows={5} isError={isFieldError.isJokeError}
                                    onChangeHandle={jokeChangeHandler}/>
                    <div className={styles.moderationJokeScreenBtnContainer}>
                        <CustomButton title={'Accept'} bgColor={'#2ecc71'} onClick={acceptHandler}
                                      fontColor={'#f0f0f0'} isSmall={true}/>
                        <CustomButton title={'Reject'} bgColor={'#D2042D'} onClick={rejectHandler}
                                      fontColor={'#f0f0f0'} isSmall={true}/>
                        <CustomButton title={'Delete'} bgColor={'#e74c3c'} onClick={deleteHandler}
                                      fontColor={'#f0f0f0'} isSmall={true}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default WithAuth(ModerateScreen);