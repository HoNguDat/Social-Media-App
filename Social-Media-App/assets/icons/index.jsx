import { theme } from "../../constants/theme";
import AddFriend from "./AddFriend";
import ArrowLeft from "./ArrowLeft";
import Call from "./Call";
import Camera from "./Camera";
import Cancel from "./Cancel";
import CircleMinus from "./CircleMinus";
import Circleplus from "./CirclePlus";
import Comment from "./Comment";
import Delete from "./Delete";
import Edit from "./Edit";
import Eye from "./Eye";
import EyeOff from "./EyeOff";
import FriendRequest from "./FriendRequest";
import Heart from "./Heart";
import Home from "./Home";
import Image from "./Image";
import ListView from "./ListView";
import Location from "./Location";
import Lock from "./Lock";
import Logout from "./logout";
import Mail from "./Mail";
import Messenger from "./Messenger";
import Notification from "./Notification";
import Plus from "./Plus";
import Search from "./Search";
import Send from "./Send";
import Share from "./Share";
import ThreeDotsCircle from "./ThreeDotsCircle";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";
import User from "./User";
import Video from "./Video";
const icons = {
  home: Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  search: Search,
  location: Location,
  call: Call,
  camera: Camera,
  edit: Edit,
  arrowLeft: ArrowLeft,
  threeDotsCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  comment: Comment,
  share: Share,
  send: Send,
  delete: Delete,
  logout: Logout,
  image: Image,
  video: Video,
  eye: Eye,
  listView: ListView,
  circlePlus: Circleplus,
  circleMinus: CircleMinus,
  cancel: Cancel,
  addFriend: AddFriend,
  messenger: Messenger,
  friendRequest: FriendRequest,
  notification: Notification,
  eyeOff: EyeOff,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" không tồn tại!`);
    return <icons.home {...props} />;
  }
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={theme.colors.textLight}
      {...props}
    />
  );
};

export default Icon;
