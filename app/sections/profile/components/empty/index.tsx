import styles from "./empty.module.css";

interface Props {
  msg: string | undefined;
}

export default function Empty({ msg }: Props) {
  return (
    <div className={styles.main}>
      <div>
        <svg
          width="42"
          height="39"
          viewBox="0 0 42 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31 6.5L35.5 2"
            stroke="#FF2681"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M31 6.5L35.5 2"
            stroke="#FF2681"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M35 14.5L40.5 13"
            stroke="#FF2681"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M35 14.5L40.5 13"
            stroke="#FF2681"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M22.2144 36.2142C21.3163 36.2142 20.4294 36.0087 19.6173 35.6123C18.8052 35.216 18.0881 34.6387 17.5174 33.9219C17.2607 33.6022 16.8796 33.4178 16.4779 33.4165H14.5221C14.1204 33.4165 13.7393 33.6022 13.4826 33.9219C12.9131 34.6391 12.1968 35.2167 11.3852 35.6131C10.5737 36.0095 9.68712 36.2148 8.78952 36.2142C7.17391 36.2132 5.62473 35.5495 4.48209 34.3688C3.33944 33.1882 2.69672 31.5871 2.69502 29.917C2.69502 28.3716 3.23016 26.919 4.19137 25.7834C6.34479 28.0917 9.57876 30.9451 13.8599 33.0795C14.0434 33.1724 14.2424 33.2188 14.4451 33.2188H16.5613C16.7628 33.2188 16.9617 33.1711 17.1439 33.0795C21.4277 30.9451 24.6591 28.0943 26.8151 25.7834C27.5798 26.6962 28.0748 27.8167 28.2413 29.0118C28.4078 30.2069 28.2388 31.4262 27.7543 32.5249C27.2699 33.6236 26.4904 34.5553 25.5085 35.2094C24.5266 35.8634 23.3837 36.2122 22.2156 36.2142M28.0573 23.1529C27.9675 18.7301 27.3733 10 24.011 10C20.7295 10 20.0648 18.222 19.9634 23.125C19.9692 23.4852 20.1097 23.8291 20.3556 24.0845C20.6014 24.3398 20.9334 24.4868 21.2818 24.4945C21.6302 24.5022 21.968 24.3701 22.2242 24.1259C22.4804 23.8817 22.6351 23.5443 22.6558 23.1847C22.761 18.0788 23.4579 14.7517 24.011 13.3549C24.5731 14.765 25.2622 18.1464 25.3585 23.316C23.4258 25.4783 20.3869 28.3106 16.2443 30.4357H14.7531C10.3834 28.1978 7.23541 25.1626 5.32968 22.9645C5.44903 17.9992 6.11892 14.7345 6.66433 13.3575C7.21745 14.7557 7.91172 18.0801 8.02081 23.1847C8.03252 23.5526 8.18303 23.901 8.44013 24.1557C8.69722 24.4103 9.0405 24.5508 9.39653 24.5471C9.75348 24.5387 10.0926 24.3843 10.3395 24.1177C10.5864 23.851 10.7208 23.494 10.7132 23.125C10.6118 18.222 9.95092 10 6.66947 10C3.23016 10 2.68347 19.1413 2.61802 23.4513C1.78592 24.2939 1.12556 25.3003 0.675918 26.411C0.226273 27.5217 -0.00354113 28.7143 4.12451e-05 29.9183C0.00309859 32.3264 0.930058 34.635 2.57757 36.3375C4.22509 38.04 6.45863 38.9975 8.78823 39C9.97216 39.0014 11.144 38.7541 12.2327 38.2732C13.3214 37.7923 14.3042 37.0877 15.1214 36.2023H15.8773C16.6954 37.0877 17.6789 37.7921 18.7682 38.273C19.8575 38.7539 21.0299 39.0013 22.2144 39C24.5436 38.9972 26.7767 38.0395 28.4237 36.3369C30.0708 34.6344 30.9973 32.3261 31 29.9183C31.0028 28.639 30.7415 27.3737 30.2336 26.2071C29.7257 25.0404 28.9829 23.9992 28.0548 23.1529"
            fill="#FF2681"
          />
        </svg>
      </div>
      <div className={styles.text}>{msg || ""}</div>
    </div>
  );
}
