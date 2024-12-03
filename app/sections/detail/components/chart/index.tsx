import { useEffect } from "react"

export default function Chart() {
    useEffect(() => {

    }, [])

    return <div style={{ paddingTop: 10 }}>
        {/* <iframe id="dexscreener-embed"
            title="Dexscreener Trading Chart"
            width="1200" height="800"
            src="https://dexscreener.com/near/refv1-4276?embed=1&theme=dark&info=0&trades=1&chart=0"></iframe> */}

        <iframe style={{ height: 'calc(100vh - 110px)' }} id="dextools-widget"
            title="DEXTools Trading Chart"
            width="100%" 
            frameBorder="none"
            src="https://dexscreener.com/near/refv1-4276?embed=1&theme=dark&info=0&trades=0"></iframe>

    </div>
}