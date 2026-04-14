import ScreenWrapper from "@/components/ScreenWrapper";
import SearchHeader from "@/components/SearchHeader";
import { theme } from "@/constants/theme";
import { useState } from "react";

const SearchFriend = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <ScreenWrapper bg={theme.colors.background}>
      <SearchHeader
        value={searchText}
        onChangeText={handleSearch}
        onClear={() => setSearchText("")}
        showBackButton={true}
      />
    </ScreenWrapper>
  );
};
SearchFriend.whydidYouRender = true;
export default SearchFriend;
