import React, { useEffect, useState } from "react";
import PlaylistCard from "../components/PlaylistCard";
import SearchBar from "../components/SrachBar";
import Image from "next/image";
import { Button } from "@mui/material";
import AddPlaylist from "../components/AddPlaylist";
import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
} from "../redux/slices/rtkSlices/playlistSlice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { playLists } from "../redux/slices/stateSlices/playlistSlice";
import { logout } from "../redux/slices/stateSlices/authSlice";
import Loader from "../components/Loader";
import ConfirmationModal from "./../components/ConfirmationModal";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Renamed state variables
  const [currentSelection, setCurrentSelection] = useState(null); // Renamed from 'selected'
  const [isAddModalOpen, setAddModalOpen] = useState(false); // Renamed from 'open'
  const [editPlaylistData, setEditPlaylistData] = useState(null); // Renamed from 'editData'
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Renamed from 'openDelete'
  const [deletePlaylistId, setDeletePlaylistId] = useState(null); // Renamed from 'openDeleteId'

  const { data, error, isLoading, refetch } = useFetchPlaylistsQuery();
  const [deletePlaylist, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeletePlaylistMutation();

  useEffect(() => {
    dispatch(playLists(data));
  }, [data?.length]);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePlaylist({ id: deletePlaylistId }).unwrap();
      setDeleteModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  return (
    <div className="w-full  ">
      <div className="flex justify-between gap-4  my-6 w-full min-[460px]:w-auto">
        <div className="hidden min-[460px]:block text-[#7f76e3] text-[16] md:text-[36px] font-[900]">
          Spotify
        </div>
        <div className="flex flex-col w-full md:flex-row justify-between ">
          <SearchBar />
        </div>
        <div className="flex gap-2 justify-between w-full min-[460px]:w-auto">
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-green-600 !text-white !rounded-full !text-[12px] md:!text-[14px] !px-3 md:!py-2 md:!px-6"
            onClick={() => handleOpenAddModal()}
          >
            Add Playlist
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-green-600 !text-white !rounded-full !text-[12px] md:!text-[14px] !px-3 md:!py-2 md:!px-6"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
      </div>

      <div>
        <div className="flex gap-5 items-center my-8">
          <AudiotrackIcon
            className={`text-[#9410AB] cursor-pointer h-[28px]`}
          />
          <div className="text-[16px] md:text-[30px] text-black font-[600]">
            My Playlists
          </div>
        </div>
      </div>
      <div className="flex flex-col  justify-between w-full gap-y-6 max-h-[65vh] overflow-y-auto">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          data?.map((item, index) => (
            <PlaylistCard
              key={index}
              item={item}
              setSelected={() => {
                setCurrentSelection(item?._id);
                router.push({
                  pathname: `/${item?.name}`,
                  query: { id: item?._id },
                });
              }}
              setEditData={() => {
                setEditPlaylistData(item);
                handleOpenAddModal();
              }}
              setDeleteData={() => {
                setDeletePlaylistId(item?._id);
                setDeleteModalOpen(true);
              }}
              selected={currentSelection}
              index={index}
            />
          ))
        )}
      </div>
      <AddPlaylist
        open={isAddModalOpen}
        handleClose={() => {
          setEditPlaylistData(null);
          handleCloseAddModal();
        }}
        data={editPlaylistData}
        refetch={refetch}
      />
      <ConfirmationModal
        message="Are you sure you want to delete this playlist"
        id={deletePlaylistId}
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        refetch={refetch}
        loading={deletePlaylist}
      />
    </div>
  );
};

export default Home;
