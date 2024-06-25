import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DrugDetail() {
    const { drugName } = useParams();
    const [drugInfo, setDrugInfo] = useState({});
    const [ndcs, setNdcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDrugDetails = async () => {
            try {
                const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`);
                if (response.data.drugGroup.conceptGroup) {
                    const drugData = (response.data.drugGroup.conceptGroup || []).find(drug => drug.conceptProperties && drug.conceptProperties[0].name.toLowerCase() === drugName.toLowerCase());
                    if (drugData) {
                        setDrugInfo(drugData.conceptProperties[0]);
                        const ndcResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${drugData.conceptProperties[0].rxcui}/ndcs.json`);
                        setNdcs(ndcResponse.data.ndcGroup.ndcList.ndc || []);
                    } else {
                        setError('Drug not found');
                    }
                } else {
                    setError('Drug not found');
                }
            } catch (err) {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchDrugDetails();
    }, [drugName]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>{drugInfo.name}</h1>
            <p>RXCUI: {drugInfo.rxcui}</p>
            <p>Synonym: {drugInfo.synonym}</p>
            <h2>NDCs</h2>
            <ul>
                {ndcs.map((ndc, index) => (<li key={index}>{ndc}</li>))}
            </ul>
        </div>
    );
}

export default DrugDetail;