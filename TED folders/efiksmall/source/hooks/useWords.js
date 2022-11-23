import { useCallback, useRef, useState } from 'react'
import { APP_URL } from '../Global/Helper/Const'
import qs from 'qs'
import showError from '../Component/ShowError'

const useWords = () => {
    // ** State
    const [endReached, setEndReached] = useState(true)
    const [data, setData] = useState([])
    
    // ** Refs
    const pageNumRef = useRef(1)

    const clearSearchResults = useCallback(() => {
        setData([])
    }, [])

    const getWordsFromApi = useCallback(async (language, searchText, showLoader) => {
        try {
            const payload = {
                language,
                search: searchText,
                page: pageNumRef.current
            }

            if (showLoader) {
                global.global_loader_ref.show_loader(1);
            }

            const newUrl = `${APP_URL}get_wordsV2?${qs.stringify(payload)}`

            const getWordsRes = await fetch(newUrl, {
                method: "GET"
            })
            global.global_loader_ref.show_loader(0);
            if (getWordsRes.ok) {
                const jsonData = await getWordsRes.json()

                const {
                    current_page,
                    data,
                    first_page_url,
                    from,
                    last_page,
                    last_page_url,
                    links,
                    next_page_url,
                    path,
                    per_page,
                    prev_page_url,
                    to,
                    total
                } = jsonData

                if (!(pageNumRef.current < last_page)) {
                    setEndReached(true)
                } else {
                    setEndReached(false)
                }
                return data
            } else {
                throw new Error("Something went wrong")
            }
        } catch (err) {
            console.log('[getWordsFromApi] Error : ', err.message)
            global.global_loader_ref.show_loader(0);
            throw new Error(err?.message)
        }
    }, [])

    const getWords = useCallback(async (language, searchText, showLoader = true) => {
        try {
            // setting the current page to 1
            pageNumRef.current = 1

            // calling api
            const getWordsFromApiRes = await getWordsFromApi(language, searchText, showLoader)
            setData(getWordsFromApiRes)
        } catch (err) {
            console.log('[getWords] Error : ', err.message)
            showError(err?.message ?? "Something went wrong please try again later.")
            setEndReached(true)
        }
    }, [])

    const fetchMore = useCallback(async (language, searchText, showLoader = false) => {
        if (endReached) {
            return
        }
        try {
            // increase page number
            pageNumRef.current += 1

            // calling api
            const getWordsFromApiRes = await getWordsFromApi(language, searchText, showLoader)
            setData(prevState => [...prevState, ...getWordsFromApiRes])
        } catch (err) {
            console.log('[fetchMore] Error : ', err.message)
            showError(err?.message ?? "Something went wrong please try again later.")
            setEndReached(true)
        }
    }, [endReached])

    return {
        data,
        endReached,
        getWords,
        fetchMore,
        clearSearchResults
    }
}

export default useWords
