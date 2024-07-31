
const addImage = ({color,height,width}: any) => {
    return (
        <svg width={width} height={height} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M14.5 29C22.5081 29 29 22.5081 29 14.5C29 6.49188 22.5081 0 14.5 0C6.49188 0 0 6.49188 0 14.5C0 22.5081 6.49188 29 14.5 29ZM15.5 8C15.5 7.44769 15.0523 7 14.5 7C13.9477 7 13.5 7.44769 13.5 8V13.5H8C7.44769 13.5 7 13.9477 7 14.5C7 15.0523 7.44769 15.5 8 15.5H13.5V21C13.5 21.5523 13.9477 22 14.5 22C15.0523 22 15.5 21.5523 15.5 21V15.5H21C21.5523 15.5 22 15.0523 22 14.5C22 13.9477 21.5523 13.5 21 13.5H15.5V8Z" fill={color}/>
        </svg>
    );
}

export default addImage;