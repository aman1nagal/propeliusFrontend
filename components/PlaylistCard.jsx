import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { formatNumber } from "../utils";
import { useDeletePlaylistMutation } from "../redux/slices/rtkSlices/playlistSlice";

const PlaylistRow = ({
  item,
  setSelectedPlaylist,
  selectedPlaylist,
  index,
  handleEdit,
  handleDelete, 
  key,
}) => {
  const isSelected = item?._id === selectedPlaylist; // Renamed variable for clarity

  return (
    <div
      key={key}
      className={`flex gap-1 md:gap-0 flex-col md:flex-row items-center justify-start md:justify-between py-4 px-6 bg-[#949292] rounded-[8px]`}
    >
      {/* Playlist index */}
      <div
        className={`text-[16px] md:text-[26px] font-[600] w-full md:w-[10%] ${
          isSelected ? "gradient-text" : "text-[#141414]"
        }`}
      >
        {formatNumber(index + 1)}
      </div>

      {/* Playlist name */}
      <div className="w-full md:w-[30%]">
        <p
          className={`w-full md:w-fit text-[16px] md:text-[26px] cursor-pointer ${
            isSelected ? "gradient-text" : "text-[#141414]"
          }`}
          onClick={() => setSelectedPlaylist(item._id)} // Updated for clarity
        >
          {item?.name}
        </p>
      </div>

      {/* Playlist description */}
      <div className="w-full md:w-[30%]">
        <p
          className={`w-full md:w-fit text-[16px] md:text-[26px] cursor-pointer ${
            isSelected ? "gradient-text" : "text-[#141414]"
          }`}
          onClick={() => setSelectedPlaylist(item._id)} // Updated for clarity
        >
          {item?.description}
        </p>
      </div>

      {/* Number of songs */}
      <div
        className={`w-full md:w-[10%] text-[16px] md:text-[26px] ${
          isSelected ? "gradient-text" : "text-[#141414]"
        }`}
      >
        {item.songs.length}
      </div>

      {/* Edit and Delete icons */}
      <div className="flex justify-start md:justify-between items-center md:ml-4 gap-3 md:gap-0 w-full md:w-[8%]">
        <EditIcon
          className={`text-[#141414] cursor-pointer`}
          onClick={() => handleEdit(item)} // Updated to pass the playlist item
        />
        <DeleteForeverIcon
          className={`text-red-500 cursor-pointer`}
          onClick={() => handleDelete(item)} // Updated to pass the playlist item
        />
      </div>
    </div>
  );
};

export default PlaylistRow;
