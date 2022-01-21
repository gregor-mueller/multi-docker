import axios from 'axios';
import {useEffect, useState} from "react";

export function Fib() {
    const [seenIndices, setSeenIndices] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    let unmounted = false;

    const fetchIndices = async () => {
        const result = await axios.get('/api/values/all')
        if (!unmounted) {
            setSeenIndices(result.data);
        }
    }

    const fetchValues = async () => {
        const result = await axios.get('/api/values/current');
        if (!unmounted) {
            setValues(result.data);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {index})
        setIndex('');
        fetchIndices();
        fetchValues();
    }

    useEffect(() => {
        fetchIndices();
        fetchValues();

        return () => {
            unmounted = true;
        }
    }, [])

    console.log('values', values)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={index}
                    onChange={event => {setIndex(event.target.value)}}
                />
                <button type={'submit'}>Submit</button>
            </form>
            <h3>Indexes I have seen:</h3>
            {seenIndices.map(({number}) => number).join(', ')}

            <h3>Calculated Values:</h3>
            {Object.entries(values).map(([key, value]) => <p key={key}>
                For index {key} I calculated {value}
            </p>)}
        </div>
    );
}