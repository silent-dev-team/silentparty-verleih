import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useFormStore = defineStore('formStore', ()=>{

    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const organization = ref('');
    const street= ref('');
    const plz = ref('');
    const city = ref('');
    const number = ref('');

    const rentFrom = ref<Date|undefined>(undefined);
    const rentTo = ref<Date|undefined>(undefined);


    const rentDays = ref<string>('1');
    const hp_count = ref<number>(20);
    const sr_count = ref<number>(3);

    const sendet = ref<boolean>(false);
    const success = ref<boolean>(false);



    function storeRequest(){
        sendet.value = true;
        fetch("http://localhost:8055/items/Anfragen",{
            method:"post",
            headers:{
                "content-type": "application/json"
            },
            body:JSON.stringify({
                vorname:firstName.value,
                nachname:lastName.value,
                organisation: organization.value,
                email:email.value,
                strasse:street.value,
                ort:city.value,
                plz: plz.value,
                hausnummer: number.value,
                start: rentFrom.value,
                ende: rentTo.value,
                kh_anzahl: hp_count.value,
                sr_anzahl: sr_count.value,
                dauer:rentDays.value
            })
        }).then(()=>{
            success.value = true;
        });
    }

    const isValid = computed(()=>{
        return firstName.value.length > 0 && lastName.value.length > 0 && email.value.length > 0 && organization.value.length > 0 && street.value.length > 0 && plz.value.length > 0 && city.value.length > 0 && rentFrom.value !== null && rentTo.value !== null;
    });
    return {
        sendet,
        success,
        firstName,
        lastName,
        email,
        organization,
        street,
        plz,
        city,
        number,
        rentFrom,
        rentTo,
        rentDays,
        hp_count,
        sr_count,
        isValid,
        storeRequest
    }
});