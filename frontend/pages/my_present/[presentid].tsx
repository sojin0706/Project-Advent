import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import PresentOne from "../../src/component/mypresent/presentone";
import PresentSeven from "../../src/component/mypresent/presentseven";
import PresentThree from "../../src/component/mypresent/presentthree";
import allAxios from "../../src/lib/allAxios";
import userAxios from "../../src/lib/userAxios";
import Head from "next/head";
import notify from "../../src/component/notify/notify";
import IsLogin from "../../src/lib/IsLogin";
import LogOut from "../../src/lib/LogOut";

export default function Present(){

    const router = useRouter()
    const presentUrl = router.query.presentid

    const [userId, setUserId] = useState<number>(0)
    const [adventDay, setAdventDay] = useState(0)
    const [presentInfo, setPresentInfo] = useState({})

    const getAdventInfo = async () => {
        // console.log(userId)
        await allAxios
            .get(`/advents/${presentUrl}/${userId}/advent`)
            .then(({ data }) => {
                // console.log(data)
                setPresentInfo(data)
                setAdventDay(data.day)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const getUserInfo = async (router: NextRouter | string[]) => {
        await userAxios.get(`/auth/users`)
            .then((data) => {
                // console.log(data.data.body.user.id)
                setUserId(data.data.body.user.id) // 유저의 userId를 받아옴
            })
            .catch((e) => {
                console.log(e)
                LogOut(router)
            });
    };


    useEffect(() => {
        if (IsLogin() && router){
            getUserInfo(router)
        }   
        if (!IsLogin()){
            router.push('/')
            notify('error', `로그인해야 접근할 수 있는 메뉴입니다❕`)
        }
    }, [router])

    useEffect(() => {
        if (userId) {
            getAdventInfo()
        }
    }, [userId])

    return(
        <>
            <Head>
                <title>보낸 선물 확인하기 | Make Our Special</title>
            </Head>
            {
                adventDay === 1?
                    <PresentOne presentInfo={presentInfo} />
                :adventDay === 3?
                    <PresentThree presentInfo={presentInfo} />
                :adventDay === 7?
                    <PresentSeven presentInfo={presentInfo} />
                :""
            }
        </>
    );
}