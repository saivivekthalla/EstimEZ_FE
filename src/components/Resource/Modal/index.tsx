import React from 'react';
import Modal from './Modal'; 
import {ConfigurationModalProps} from "@/helper/constants/types/ResourcePlanningtypes/CalenderTypes"

function ConfigurationModal({ open, handleClose, durationType, calendarProps1, onChildDataChange, resourcePlann, currentPhase, existingDatas, selectedRole, getLatestData }: ConfigurationModalProps) {
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${open ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="z-[999]">
          <Modal
            open={open}
            durationType={durationType}
            handleClose={handleClose}
            calendarProps1={calendarProps1}
            onChildDataChange={onChildDataChange}
            resourcePlann={resourcePlann}
            currentPhase={currentPhase}
            existingDatas={existingDatas}
            selectedRole={selectedRole}
            getLatestData={getLatestData}
          />
        </div>
      </div>
    </div>
  );
}

export default ConfigurationModal;
