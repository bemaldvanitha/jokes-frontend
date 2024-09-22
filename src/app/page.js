"use client";
import React, { useState, useMemo, useEffect } from 'react';

import CustomSelect from "@/components/common/custom-select/CustomSelect";
import CustomButton from "@/components/common/custom-button/CustomButton";
import CustomLoader from "@/components/common/custom-loader/CustomLoader";
import { useGetRandomJokesQuery, useGetAllJokeTypesQuery, useGetRandomJokeByCategoryQuery
    } from "@/slicers/deliverJokesSlice";

import styles from "./page.module.css";

const HomeScreen = () => {
    const [types, setTypes] = useState([
        { id: 0, type: 'General' }
    ]);

    const [joke, setJoke] = useState({
        id: 0,
        joke: '',
        createdAt: ""
    });

    const [selectedType, setSelectedType] = useState({
       id: 0,
       type: 'General'
    });

    const { data: randomJokeData, isLoading: randomJokeIsLoading, refetch: randomJokeRefetch,
        error: randomJokeError } = useGetRandomJokesQuery();
    const { data: typeData, isLoading: typeIsLoading, error: typeError } = useGetAllJokeTypesQuery();
    const { data: randomJokeByCategoryData, isLoading: randomJokeByCategoryIsLoading,
        refetch: randomJokesByCategoryRefetch, error: randomJokeByCategoryError } =
        useGetRandomJokeByCategoryQuery(selectedType?.id, { skip: selectedType?.id === 0 });

    useEffect(() => {
        if(typeData?.types){
            const fetchTypes = typeData?.types || [];
            const transformedData = fetchTypes.map(item => ({
                id: item?.id,
                type: item?.type
            }));

            transformedData.unshift({ id: 0, type: 'General' });
            setTypes(transformedData);
        }
    }, [typeData]);

    useEffect(() => {
        if(randomJokeData?.joke){
            let fetchedJoke = randomJokeData?.joke;
            setJoke({
                id: fetchedJoke?.id,
                joke: fetchedJoke?.joke,
                createdAt: fetchedJoke?.createdAt
            });
        }
    }, [randomJokeData]);

    useEffect(() => {
        if(randomJokeByCategoryData?.joke){
            let fetchedJoke = randomJokeByCategoryData?.joke;
            setJoke({
                id: fetchedJoke?.id,
                joke: fetchedJoke?.joke,
                createdAt: fetchedJoke?.createdAt
            });
        }
    }, [selectedType, randomJokeByCategoryData]);

    const typeStrings = useMemo(() => {
        return types.map(typeObject => typeObject.type);
    }, [types]);

    const typeChangeHandler = (e) => {
        const idx = types.findIndex(type => type.type === e.target.value);
        const selectedType = types[idx];

        setSelectedType({
            id: selectedType.id,
            type: selectedType.type
        });
    }

    const getNewJokeHandler = async () => {
        if(selectedType?.type === 'General'){
            await randomJokeRefetch();
        }else {
            await randomJokesByCategoryRefetch();
        }
    }

    if(randomJokeByCategoryIsLoading || randomJokeIsLoading || typeIsLoading){
        return <CustomLoader/>
    }else {
        return (
            <div className={styles.homeScreen}>
                <div className={styles.homeScreenContainer}>
                    <p className={styles.homeScreenTitle}>Generate A Joke</p>
                    <p className={styles.homeScreenSelectText}>Select a category</p>
                    <CustomSelect id={'type'} title={'Select Type'} isError={false} errorMessage={''}
                                  onChangeHandle={typeChangeHandler} value={selectedType.type}
                                  options={typeStrings} isLabelAvailable={false} isSmall={true}/>
                    <p className={styles.homeScreenJokeText}>{joke?.joke}</p>
                    <CustomButton title={'Generate'} bgColor={'#e74c3c'} onClick={getNewJokeHandler}
                                  fontColor={'#f0f0f0'}/>
                </div>
            </div>
        );
    }
}

export default HomeScreen;