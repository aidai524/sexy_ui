import Modal from '@/app/components/modal'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface TokenStatusModalProps {
    status: number
    onClose?: () => void
}

export const TokenStatusModal: React.FC<TokenStatusModalProps> = ({ status, onClose }) => {
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 2) {
            setVisible(true);
        }
    }, [status, onClose])

    return <Modal
        open={visible}
        onClose={() => {
            setVisible(false);
            router.push("/");       
            // onClose?.();
        }}
        mainStyle={{
            border: 0,
        }}
        closeStyle={{
            top: -20,
        }}
        maskClose={false}
    >
        <div style={{
            background: '#fff',
            color: '#000',
            borderRadius: '8px',
            padding: '16px',
            position: 'relative'
        }}>
            This product will be on Dex soon.
        </div>

    </Modal>
}