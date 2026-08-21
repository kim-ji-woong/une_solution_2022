using System;
using System.Collections.Generic;
using System.Collections.Concurrent;

namespace IntegrationServer.Servers.Elevator.Otis
{
    using ViewModels.Elevator;

    class MessageParser
    {
        // Key : Transaction ID
        // Value : Start Address
        private ConcurrentDictionary<ushort, int> m_dicTransactionAddress = new ConcurrentDictionary<ushort, int>();
        private OtisManager m_mgr = null;

        public MessageParser(OtisManager mgr)
        {
            m_mgr = mgr;
        }

        public void SetTransaction(ushort transactionID, int startAddress)
        {
            m_dicTransactionAddress.TryAdd(transactionID, startAddress);
        }

        // 상태가 바뀐 엘리베이터만 리턴한다.
        public Elevator Parse(byte[] bytes, out ushort transactionID)
        {
            transactionID = 0;
            int len = bytes.Length;

            if (len < 6)
                return null;

            /*int */transactionID = (ushort)GetData(bytes, 0);
            int startAddress = GetStartAddress((ushort)transactionID);

            if (startAddress < 0)
                return null;

            int totalLength = GetData(bytes, 4);

            if (totalLength + 6 > len)
            {
                // Packet 유실
                return null;
            }

            if (totalLength < 3)
                return null;

            int groupNo = (int)bytes[6];
            int byteCount = (int)bytes[8];

            if (byteCount < 12 || byteCount + 9 > len)
                return null;

            int frontDoor = (int)bytes[14];
            int rearDoor = (int)bytes[16];
            int pos = (int)bytes[20];

            int index = GetIndex(startAddress);
            Elevator elevator = m_mgr.GetElevator(groupNo, index);

            if (elevator == null)
                return null;

            Elevator.DoorStatus status;
            Elevator.DirectionStatus direction;

            GetDoorStatusNDirection(frontDoor, rearDoor, out status, out direction);
            int floorIndex = GetFloorIndex(pos, elevator);

            if (IsChanged(elevator, status, direction, floorIndex))
            {
                Elevator changedElevator = new Elevator();
                changedElevator.ID = elevator.ID;
                changedElevator.Floor = floorIndex;
                changedElevator.Direction = (int)direction;
                changedElevator.Door = (int)status;

                return changedElevator;
            }

            return null;
        }

        private bool IsChanged(Elevator elevator, Elevator.DoorStatus status, Elevator.DirectionStatus direction, int floorIndex)
        {
            if (elevator.Floor != floorIndex)
                return true;

            if (elevator.Direction != (int)direction)
                return true;

            if (elevator.Door != (int)status)
                return true;

            return false;
        }

        private int GetFloorIndex(int pos, Elevator elevator)
        {
            int floorIndex = elevator.MinFloor + pos - 1;
            return floorIndex;
        }

        private void GetDoorStatusNDirection(int door1, int door2, out Elevator.DoorStatus status, out Elevator.DirectionStatus direction)
        {
            int door = door1;

            if (door1 == 0)
            {
                if (door2 != 0)
                    door = door2;
            }
            else if (door2 == 0)
            {
                door = door1;
            }

            status = Elevator.DoorStatus.Closed;

            if ((door & 1) == 0 && (door & 2) == 2)
                status = Elevator.DoorStatus.Opened;
            else if ((door & 1) == 1 && (door & 2) == 2)
                status = Elevator.DoorStatus.Opened;

            direction = Elevator.DirectionStatus.None;

            if ((door & 16) == 16 && (door & 32) == 0)
                direction = Elevator.DirectionStatus.Up;
            else if ((door & 16) == 0 && (door & 32) == 32)
                direction = Elevator.DirectionStatus.Down;
        }

        private int GetIndex(int startAddress)
        {
            return startAddress / 4700;
        }

        private int GetStartAddress(ushort transactionID)
        {
            int startAddress;

            if (m_dicTransactionAddress.TryRemove(transactionID, out startAddress))
            {
                return startAddress;
            }

            return -1;
        }

        private int GetData(byte[] bytes, int index)
        {
            byte[] bytes2 = new byte[2];
            bytes2[1] = bytes[index];
            bytes2[0] = bytes[index + 1];

            return BitConverter.ToInt16(bytes2);
        }
    }
}
