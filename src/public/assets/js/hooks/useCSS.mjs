'use strict';
import {
    useRef,
    useEffect,
} from 'https://unpkg.com/htm/preact/standalone.module.js';

const tags = {};

const useCSS = (css) => {
    const tag = useRef();

    const reuseExistingTag = () => {
        tag.current = tags[css].tag;
        tags[css].count++;
    };

    const createNewTag = () => {
        tag.current = document.createElement('style');
        document.head.appendChild(tag.current);
        tags[css] = {
            tag: tag.current,
            count: 1,
        };
    };

    useEffect(() => {
        if (tags[css]) {
            reuseExistingTag();
        } else {
            createNewTag();
        }

        return () => {
            tags[css].count--;

            if (tags[css].count === 0) {
                document.head.removeChild(tags[css].tag);
                delete tags[css];
            }
        };
    }, []);

    useEffect(() => {
        if (tags[css]) {
            reuseExistingTag();
        } else {
            createNewTag();
        }

        tag.current.innerHTML = css;

        return () => {
            tags[css].count--;

            if (tags[css].count === 0) {
                document.head.removeChild(tags[css].tag);
                delete tags[css];
            }
        };
    }, [css]);
};

export default useCSS;
