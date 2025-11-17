import MainBody from "@/components3D/Modules/MainBody";
import Roof from "@/components3D/Modules/Roof";
import AlignModelList from "@/components3D/Models/Draggable/AlignModelList";

export default function Building() {
  return (
    <>
      <MainBody />
      <Roof />
      <AlignModelList />
    </>
  )
}