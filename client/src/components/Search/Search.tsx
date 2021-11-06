import React, {useState} from "react";

import Input from '../Input/Input';
import I18n from "../../services/I18n";

const Search = (props: any) => {

    const [search, setSearch] = useState('');

    const handleSearch = (event: any) => {
        setSearch(event.target.value);
        props.handleSearchValue(event.target.value);
    }

    return(
        <div className="search">
            <form>
                <Input type="text" name="search" value={search} onChange={handleSearch} placeholder={I18n.get.labels.search} />
            </form>
        </div>
    );
}

export default Search;
