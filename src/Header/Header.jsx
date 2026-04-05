import HeaderStyles from './Header.module.css';
import { UserRoundPen } from 'lucide-react'
import useGetDocuments from './useGetDocuments';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const allDocument = useGetDocuments();
    const [searchResult, setSearchResult] = useState("");
    const searchRef = useRef();

    useEffect(() => {
        if (searchResult == "") {
            return;
        }
        while (searchRef.current.children.length != 1) {
            searchRef.current.removeChild(searchRef.current.lastElementChild)
        }
        let documentTitles = [];
        allDocument.map((document) => {
            if (document.title.includes(searchResult)) {
                documentTitles.push(document.title);
            }
        })
        let bottomDifference = 3;
        documentTitles.map((docTitle) => {
            const docFoundContainer = document.createElement('div');
            docFoundContainer.className = HeaderStyles["search-result"];
            docFoundContainer.style.bottom = `-${bottomDifference}rem`;
            bottomDifference += 3;
            const docFound = document.createElement('p');
            docFound.textContent = docTitle;
            docFoundContainer.appendChild(docFound);
            searchRef.current.appendChild(docFoundContainer);
        })
            
    }, [searchResult])

    function removeSearchResults() {
        while (searchRef.current.children.length != 1) {
            searchRef.current.removeChild(searchRef.current.lastElementChild)
        }
    }

    return (
        <div className={HeaderStyles.header}>
            <div className={HeaderStyles["left-side"]}>
                <h2 className={HeaderStyles["company-name"]}>Document Manager</h2>
            </div>
            <div className={HeaderStyles["right-side"]}>
                <div ref={searchRef} className={HeaderStyles["search-bar-container"]}>
                    <input className={HeaderStyles["search-bar"]} type="text" onChange={(e) => {setSearchResult(e.target.value)}} onBlur={removeSearchResults} placeholder='Search documents...'/>
                </div>
                <button className={HeaderStyles["upload-btn"]}>Upload</button>
                <div className={HeaderStyles["profile-pic"]}>
                    <UserRoundPen size={32} className={HeaderStyles["profile-pic-icon"]}/>
                </div>
            </div>
        </div>
    )
}