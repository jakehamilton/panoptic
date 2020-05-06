'use strict';
import {
    useState,
    useEffect,
} from 'https://unpkg.com/htm/preact/standalone.module.js';

const useFetch = (url, options) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(null);

        fetch(url, options)
            .then((response) => response.json())
            .then((json) => {
                setData(json);
            });
    }, [url]);

    return {
        loaded: Boolean(data),
        data,
    };
};

export default useFetch;
