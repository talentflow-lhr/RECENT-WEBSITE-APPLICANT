import { useState, useRef, useEffect } from 'react';
import { supabase } from "../supabaseClient";


export function useHasResume() {
    const [hasResume, setHasResume] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("account");
        if (!stored) return;

        const { applicant_id } = JSON.parse(stored);


        const checkResume = async () => {
            const {data, error} = await supabase
                .from("t_resume")
                .select("applicant_id")
                .eq("applicant_id", applicant_id);

            if (error) console.log("Error fetching resume:", error);

            if (data && data.length > 0) setHasResume(true);
        }

        checkResume();
    }, []);

    return hasResume;
}