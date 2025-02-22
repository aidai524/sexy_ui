// @ts-ignore
import Croppie from "croppie";

const orientationMap = [2, 5, 3, 7]

export default async function ImgCopper({ file }: { file: File }) {
  return new Promise(async (resolve, reject) => {
    const url = await new Promise<string | void>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result;
        if (typeof res !== "string") return resolve();
        resolve(res);
      };
      reader.readAsDataURL(file);
    });
    if (!url) return;

    // const img = new Image();
    // await new Promise<[number, number]>(
    //   (resolve) => {
    //     img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
    //     img.src = url;
    //   }
    // );

    const cropperContainer = document.createElement('div');
    cropperContainer.className = 'cropper-flip-container';
    document.body.appendChild(cropperContainer);

    const header = document.createElement('div');
    header.className = 'cropper-header';
    header.style.cssText = '';

    const cancelBtn = document.createElement('div');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'color: #9290B1; font-size: 16px;';
    cancelBtn.onclick = () => {
      cropperContainer.remove();
      reject(null);
    };

    const rotateBtn = document.createElement('div');
    rotateBtn.innerHTML = `<svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.3301 2.83978C15.7056 3.51304 16.9105 4.48945 17.8542 5.69554L17.8552 5.69454C18.6932 6.76058 19.3066 7.98543 19.658 9.29511C20.0095 10.6048 20.0919 11.9721 19.9002 13.3145H18.0082C18.0342 13.1815 18.0512 13.0455 18.0682 12.9095C18.1997 11.8371 18.1181 10.7493 17.8281 9.70847C17.5381 8.66766 17.0453 7.69439 16.3781 6.84454C15.7 5.97778 14.8554 5.2553 13.8941 4.71954C12.965 4.20387 11.9449 3.87278 10.89 3.74454C10.564 3.70454 10.236 3.68354 9.91002 3.68154V5.29254C9.91202 5.45554 9.72202 5.54654 9.59201 5.44554L6.35896 2.89754C6.33563 2.879 6.31679 2.85543 6.30384 2.82859C6.29089 2.80176 6.28416 2.77234 6.28416 2.74254C6.28416 2.71274 6.29089 2.68333 6.30384 2.65649C6.31679 2.62965 6.33563 2.60608 6.35896 2.58754L9.59001 0.0415437C9.61902 0.0189633 9.65377 0.00495033 9.69033 0.00108955C9.72689 -0.00277124 9.7638 0.00367418 9.79689 0.0196969C9.82997 0.0357197 9.85791 0.0606804 9.87755 0.0917562C9.89719 0.122832 9.90775 0.158783 9.90802 0.195544L9.91302 1.80854C11.4444 1.81393 12.9547 2.16652 14.3301 2.83978ZM0.808013 7.95147H14.1362C14.2422 7.95121 14.3473 7.97186 14.4453 8.01225C14.5433 8.05264 14.6324 8.11197 14.7075 8.18684C14.7825 8.26171 14.8421 8.35065 14.8827 8.44857C14.9233 8.54649 14.9442 8.65146 14.9442 8.75747V22.1925C14.9442 22.6395 14.5832 22.9995 14.1362 22.9995H0.808013C0.361006 22.9995 0 22.6395 0 22.1925V8.75747C0 8.65146 0.0209139 8.54649 0.0615448 8.44857C0.102176 8.35065 0.161725 8.26171 0.236783 8.18684C0.31184 8.11197 0.40093 8.05264 0.498951 8.01225C0.596972 7.97186 0.701998 7.95121 0.808013 7.95147ZM1.91703 21.0835H13.0242V9.86647H1.91703V21.0835Z" fill="white"/>
</svg>
`;
    rotateBtn.style.cssText = 'color: #fff; font-size: 16px;';
    rotateBtn.onclick = () => {
      const { orientation } = cropper.get()
      setTimeout(() => {
        const nextOrientation = orientationMap[(orientationMap.indexOf(orientation) + 1) % orientationMap.length] 
        cropper.bind({ 
          url: url, 
          orientation: nextOrientation, 
          // zoom: 0 
        });
      }, 200);
    };

    const doneBtn = document.createElement('div');
    doneBtn.textContent = 'Done';
    doneBtn.style.cssText = 'background: #FBCA04; color: #000; font-size: 16px; padding: 8px 20px; border-radius: 100px;';
    doneBtn.onclick = () => {
      cropper.result({ type: "blob", size: "viewport" }).then((blob: any) => {
        rotateBtn.onclick = null
        doneBtn.onclick = null
        cropper.destroy();
        cropperContainer.remove();
        resolve(blob);
      });
    };

    // cropperContainer.appendChild(img);

    header.appendChild(cancelBtn);
    header.appendChild(rotateBtn);
    header.appendChild(doneBtn);
    cropperContainer.appendChild(header);

    const cropper = new Croppie(cropperContainer, {
      viewport: { width: 250, height: 250, type: "circle" },
      boundary: { width: window.innerWidth, height: 250 },
      showZoomer: true,
      enableOrientation: true,
      enableResize: false,
      enableMove: true,
      enableRotate: true,
    });

    cropper.bind({
      url: url,
      orientation: 2,
      // zoom: 0
    });

  });
}   