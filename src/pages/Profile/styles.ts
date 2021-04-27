import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 50 : 40}px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
  color: #f5ede8;
`;

export const BackButton = styled.TouchableOpacity``;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;
